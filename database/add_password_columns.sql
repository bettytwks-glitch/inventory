-- Run against [Inventory] database
USE [Inventory];

ALTER TABLE dbo.employees
  ADD password_hash        nvarchar(256) NULL,
      must_change_password bit           NOT NULL CONSTRAINT DF_emp_must_change DEFAULT 1,
      reset_token          nvarchar(256) NULL,
      reset_token_expires  datetime2     NULL;