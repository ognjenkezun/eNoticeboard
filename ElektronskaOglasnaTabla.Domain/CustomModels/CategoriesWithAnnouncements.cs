using System.Collections.Generic;

namespace ElektronskaOglasnaTabla.Domain.CustomModels
{
    public class CategoriesWithAnnouncements
    {
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
        public int MyProperty { get; set; }
        public List<CategoriesWithAnnouncements> Announcements { get; set; }
    }
}
