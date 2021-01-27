using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ElektronskaOglasnaTabla.Domain.Models
{
    public partial class Announcements
    {
        public Announcements()
        {
            Files = new HashSet<Files>();
        }
        [Key]
        public int AnnouncementId { get; set; }
        public string AnnouncementTitle { get; set; }
        public string AnnouncementDescription { get; set; }
        public DateTime AnnouncementDateCreated { get; set; }
        public DateTime? AnnouncementDateModified { get; set; }
        public DateTime AnnouncementExpiryDate { get; set; }
        public int AnnouncementImportantIndicator { get; set; }
        [Column(TypeName = "nvarchar(450)")]
        public string UserModifiedId { get; set; }
        //[Required]
        [Column(TypeName = "nvarchar(450)")]
        public string UserCreatedId { get; set; }
        public int CategoryId { get; set; }
        public bool AnnouncementShow { get; set; }

        public virtual ApplicationUser UserCreated { get; set; }
        public virtual ApplicationUser UserModified { get; set; }
        public virtual Categories Category { get; set; }
        public virtual ICollection<Files> Files { get; set; }
    }
}
