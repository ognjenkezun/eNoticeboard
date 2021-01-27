using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ElektronskaOglasnaTabla.Domain.Models
{
    public partial class Priorities
    {
        public Priorities()
        {
            Categories = new HashSet<Categories>();
        }
        [Key]
        public int PriorityId { get; set; }
        public string PriorityValue { get; set; }

        public virtual ICollection<Categories> Categories { get; set; }
    }
}
