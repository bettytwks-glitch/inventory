using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InventoryApi.Models;

[Table("fa_categories")]
public class FaCategory
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("major_category")]
    public string MajorCategory { get; set; } = string.Empty;

    [Column("major_description")]
    public string MajorDescription { get; set; } = string.Empty;

    [Column("minor_category")]
    public string MinorCategory { get; set; } = string.Empty;

    [Column("minor_description")]
    public string MinorDescription { get; set; } = string.Empty;
}
