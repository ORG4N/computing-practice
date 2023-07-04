using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace doki_doki_delight_management_system.Models
{
    public class Booking
    {
        public string BookingID { get; set; }
        public string UserID { get; set; }

        public string Occupants { get; set; }
        public string Date { get; set; }
        public string Time { get; set; }

    }
}
