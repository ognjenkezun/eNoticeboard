using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ElektronskaOglasnaTabla.Domain.Models
{
    public partial class AppConfig
    {
        [Key]
        public int Id { get; set; }
        public int AnnouncementExpiry { get; set; }
        public int SlideDurationOnTv { get; set; }
        public int AutomaticallyUpdate { get; set; }
        public int NumberOfLastAnnPerCategory { get; set; }
    }
}
