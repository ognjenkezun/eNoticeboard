using System;
using System.Collections.Generic;

namespace ElektronskaOglasnaTabla.Domain.Models
{
    public partial class Users
    {
        public Users()
        {
            AnnouncementsAnnouncementUserModifiedNavigation = new HashSet<Announcements>();
            AnnouncementsUser = new HashSet<Announcements>();
        }

        public int UserId { get; set; }
        public string UserFirstName { get; set; }
        public string UserLastName { get; set; }
        public string UserPassword { get; set; }
        public string UserEmail { get; set; }
        public int UserTypeId { get; set; }

        public virtual UserTypes UserType { get; set; }
        public virtual ICollection<Announcements> AnnouncementsAnnouncementUserModifiedNavigation { get; set; }
        public virtual ICollection<Announcements> AnnouncementsUser { get; set; }
    }
}
