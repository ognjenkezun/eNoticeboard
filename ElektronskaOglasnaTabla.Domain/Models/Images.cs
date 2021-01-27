using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ElektronskaOglasnaTabla.Domain.Models
{
    public partial class Images
    {
        [Key]
        public int ImageId { get; set; }
        public string ImagePath { get; set; }
    }
}
