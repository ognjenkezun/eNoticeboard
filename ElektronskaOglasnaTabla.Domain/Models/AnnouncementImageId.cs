using System;
using System.Collections.Generic;

namespace ElektronskaOglasnaTabla.Domain.Models
{
    public partial class AnnouncementImageId
    {
        public int AnnouncementImageIds { get; set; }
        public int ImageId { get; set; }
        public int AnnouncementId { get; set; }

        public virtual Announcements Announcement { get; set; }
    }
}
