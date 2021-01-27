using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ElektronskaOglasnaTabla.Domain.Models
{
    public partial class Users
    {
        [Key]
        public int UserId { get; set; }
        public string UserFirstName { get; set; }
        public string UserLastName { get; set; }
        public string UserPassword { get; set; }
        public string UserEmail { get; set; }
        public int UserTypeId { get; set; }

        public virtual UserTypes UserType { get; set; }
    }
}
