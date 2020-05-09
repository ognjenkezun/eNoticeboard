using System;
using System.Collections.Generic;

namespace ElektronskaOglasnaTabla.Domain.Models
{
    public partial class Announcements
    {
        public Announcements()
        {
            AnnouncementImageId = new HashSet<AnnouncementImageId>();
        }

        public int AnnouncementId { get; set; }
        public string AnnouncementTitle { get; set; }
        public string AnnouncementDescription { get; set; }
        public DateTime AnnouncementDateCreated { get; set; }
        public DateTime? AnnouncementDateModified { get; set; }
        public int? AnnouncementUserModified { get; set; }
        public DateTime? AnnouncementExpiryDate { get; set; }
        public int AnnouncementImportantIndicator { get; set; }
        public int UserId { get; set; }
        public int CategoryId { get; set; }
        public bool IsDeleted { get; set; }

        public virtual Users AnnouncementUserModifiedNavigation { get; set; }
        public virtual Categories Category { get; set; }
        public virtual Users User { get; set; }
        public virtual ICollection<AnnouncementImageId> AnnouncementImageId { get; set; }
    }
}
