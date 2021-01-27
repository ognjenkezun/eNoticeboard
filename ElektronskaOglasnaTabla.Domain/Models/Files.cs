using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace ElektronskaOglasnaTabla.Domain.Models
{
    public class Files
    {
        [Key]
        public int FileId { get; set; }
        public string FilePath { get; set; }
        public int AnnouncementId { get; set; }
        public string Type { get; set; }
    }
}