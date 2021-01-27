using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace ElektronskaOglasnaTabla.Domain.Models
{
    public class ResetPasswordModel
    {
        [Required]
        public string Password { get; set; }
        [Required]
        [Compare("Password", ErrorMessage =
            "The new password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }

        public string Email { get; set; }
        public string Token { get; set; }
    }
}
