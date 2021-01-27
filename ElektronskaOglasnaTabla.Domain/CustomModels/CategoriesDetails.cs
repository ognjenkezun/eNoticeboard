using ElektronskaOglasnaTabla.Domain.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace ElektronskaOglasnaTabla.Domain.CustomModels
{
    public class CategoriesDetails
    {
        public CategoriesDetails()
        {
            Announcements = new HashSet<AnnouncementDetails>();
        }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
        public int PriorityId { get; set; }
        public string PriorityValue { get; set; }
        public virtual ICollection<AnnouncementDetails> Announcements { get; set; }
    }
}
