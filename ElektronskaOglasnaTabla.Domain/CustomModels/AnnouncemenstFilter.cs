using System;
using System.Collections.Generic;
using System.Text;

namespace ElektronskaOglasnaTabla.Domain.CustomModels
{
    public class AnnouncemenstFilter
    {
        //Filter
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

        //Sort
        public string sortDirection { get; set; }
        public string dir = "desc";

        //Pagination
        public int page { get; set; }
        public int pageSize { get; set; }
    }
}
