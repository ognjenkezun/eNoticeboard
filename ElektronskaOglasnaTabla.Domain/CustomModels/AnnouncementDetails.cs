using ElektronskaOglasnaTabla.Domain.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace ElektronskaOglasnaTabla.Domain.CustomModels
{
    public class AnnouncementDetails
    {
        public AnnouncementDetails()
        {
            Files = new HashSet<Files>();
        }

        public int AnnouncementId { get; set; }
        public string AnnouncementTitle { get; set; }
        public string AnnouncementDescription { get; set; }
        public DateTime AnnouncementDateCreated { get; set; }
        public DateTime? AnnouncementDateModified { get; set; }
        public DateTime? AnnouncementExpiryDate { get; set; }
        public int ImportantIndicator { get; set; }
        public string UserCreatedId { get; set; }
        public string UserCreatedFirstName { get; set; }
        public string UserCreatedLastName { get; set; }
        public string UserCreatedEmail { get; set; }
        public int UserCreatedTypeId { get; set; }
        public string UserCreatedTypeName { get; set; }
        public string UserModifiedId { get; set; }
        public string UserModifiedFirstName { get; set; }
        public string UserModifiedLastName { get; set; } = "";
        public string UserModifiedEmail { get; set; } = "";
        public int? UserModifiedTypeId { get; set; }
        public string UserModifiedTypeName { get; set; } = "";
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
        public int PriorityId { get; set; }
        public string PriorityValue { get; set; }
        public bool AnnouncementShow { get; set; }

        public virtual ICollection<Files> Files { get; set; }
    }
}
