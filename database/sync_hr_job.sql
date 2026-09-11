-- ============================================================
-- 每日人事資料同步 SQL Server Agent Job
-- 來源: [10.200.16.13].[eHR_DB].[dbo].[WPVW_EMPDATA]  (唯讀)
-- 目標: [Inventory].[dbo].[employees]  (只動這張表)
-- 執行: 在 oci-eip02 的 SSMS 以 sa 或有 msdb 權限的帳號執行
-- ============================================================

USE [msdb];
GO

-- 避免重複建立
IF EXISTS (SELECT 1 FROM msdb.dbo.sysjobs WHERE name = N'每日人事資料同步')
BEGIN
    EXEC sp_delete_job @job_name = N'每日人事資料同步', @delete_unused_schedule = 1;
END
GO

DECLARE @jobId   UNIQUEIDENTIFIER;
DECLARE @schedId INT;

-- ── 1. 建立 Job ──────────────────────────────────────────────
EXEC sp_add_job
    @job_name              = N'每日人事資料同步',
    @enabled               = 1,
    @description           = N'每天從 eHR 系統 WPVW_EMPDATA 同步人員資料到 Inventory.dbo.employees',
    @notify_level_eventlog = 2,
    @job_id                = @jobId OUTPUT;

-- ── 2. 加入執行步驟 ───────────────────────────────────────────
EXEC sp_add_jobstep
    @job_id        = @jobId,
    @step_name     = N'MERGE eHR → employees',
    @subsystem     = N'TSQL',
    @database_name = N'Inventory',
    @command       = N'
-- 只寫入 Inventory.dbo.employees，來源為唯讀
MERGE dbo.employees AS target
USING (
    SELECT
        EMPLOYEEID,
        TRUENAME,
        UNITCODE,
        COMPANYEMAIL,
        AREA,
        CASE
            WHEN ACCESSIONSTATE = N''離職'' THEN CAST(0 AS BIT)
            ELSE CAST(1 AS BIT)
        END AS is_active
    FROM [10.200.16.13].[eHR_DB].[dbo].[WPVW_EMPDATA]
    WHERE EMPLOYEEID IS NOT NULL AND EMPLOYEEID <> ''''
) AS source ON target.employee_id = source.EMPLOYEEID

-- 已存在的員工：更新姓名、部門、信箱、廠區、在職狀態
WHEN MATCHED THEN
    UPDATE SET
        target.name       = source.TRUENAME,
        target.department = ISNULL(NULLIF(source.UNITCODE, ''''), target.department),
        target.email      = source.COMPANYEMAIL,
        target.site       = source.AREA,
        target.is_active  = source.is_active

-- HR 有但我們沒有的新進員工（非離職）：新增，預設 role = user
WHEN NOT MATCHED BY TARGET AND source.is_active = 1 THEN
    INSERT (employee_id, name, department, email, site, is_active, ad_account, role, created_at)
    VALUES (
        source.EMPLOYEEID,
        source.TRUENAME,
        ISNULL(NULLIF(source.UNITCODE, ''''), ''''),
        source.COMPANYEMAIL,
        source.AREA,
        1,
        '''',
        ''user'',
        GETUTCDATE()
    );
',
    @on_success_action = 1,
    @on_fail_action    = 2;

-- ── 3. 建立每日排程（每天 07:00）─────────────────────────────
EXEC sp_add_schedule
    @schedule_name     = N'每日07:00同步',
    @freq_type         = 4,
    @freq_interval     = 1,
    @active_start_time = 70000,
    @schedule_id       = @schedId OUTPUT;

EXEC sp_attach_schedule
    @job_id      = @jobId,
    @schedule_id = @schedId;

-- ── 4. 指定執行伺服器 ─────────────────────────────────────────
EXEC sp_add_jobserver
    @job_id      = @jobId,
    @server_name = N'(LOCAL)';

GO

PRINT N'Job [每日人事資料同步] 建立完成，每天 07:00 執行。';
GO
