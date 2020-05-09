using System;
using System.Collections.Generic;
using System.Text;

namespace ElektronskaOglasnaTabla.Domain.CustomModels
{
    public class AnnouncementDetails
    {
        public int AnnouncementId { get; set; }
        public string AnnouncementTitle { get; set; }
        public string AnnouncementDescription { get; set; }
        public DateTime AnnouncementDateCreated { get; set; }
        public DateTime? AnnouncementDateModified { get; set; }
        public DateTime? AnnouncementExpiryDate { get; set; }
        public int ImportantIndicator { get; set; }
        public int UserId { get; set; }
        public string UserFirstName { get; set; }
        public string UserLastName { get; set; }
        public string UserEmail { get; set; }
        public int UserTypeId { get; set; }
        public string UserTypeName { get; set; }
        public int? UserIdModified { get; set; }
        public string UserModifiedFirstName { get; set; }
        public string UserModifiedLastName = "";
        public string UserModifiedEmail = "";
        public int? UserModifiedTypeId { get; set; }
        public string UserModifiedTypeName = "";
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
        public int PriorityId { get; set; }
        public string PriorityValue { get; set; }
    }
}
