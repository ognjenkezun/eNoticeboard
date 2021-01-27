using System;
using System.Collections.Generic;
using System.Text;

namespace ElektronskaOglasnaTabla.Domain.Models
{
    public class Message
    {
        public string clientuniqueid { get; set; }
        public string type { get; set; }
        public string message { get; set; }
        public DateTime date { get; set; }
    }
}
