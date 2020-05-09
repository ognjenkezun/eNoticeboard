using System;
using System.Collections.Generic;

namespace ElektronskaOglasnaTabla.Domain.Models
{
    public partial class UserTypes
    {
        public UserTypes()
        {
            Users = new HashSet<Users>();
        }

        public int UserTypeId { get; set; }
        public string UserTypeName { get; set; }

        public virtual ICollection<Users> Users { get; set; }
    }
}
