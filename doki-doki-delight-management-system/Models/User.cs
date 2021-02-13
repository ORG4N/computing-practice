using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace doki_doki_delight_management_system.Models
{
    public class User
    {
        public string UserID { get; set; }

        public string Role { get; set; }
        public string Forename { get; set; }
        public string Surname { get; set; }
        public string Email { get; set; }
        public string Tel { get; set; }

    }
}
