using System;
using System.Collections.Generic;
using System.Text;

namespace ElektronskaOglasnaTabla.Domain.Models
{
    public class AnnouncementSearch
    {
        public string AnnouncementTitle { get; set; }
        public string AnnouncementDescription { get; set; }
        public DateTime? AnnouncementDateCreated { get; set; }
        public DateTime? AnnouncementDateModified { get; set; }
        public DateTime AnnouncementExpiryDate { get; set; }
        public int AnnouncementImportantIndicator { get; set; }
        public string UserModifiedId { get; set; }
        public string UserCreatedId { get; set; }
        public int CategoryId { get; set; }
        public bool AnnouncementShow { get; set; }
    }
}
