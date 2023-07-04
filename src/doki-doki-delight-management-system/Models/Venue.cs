using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace doki_doki_delight_management_system.Models
{
    public class Venue
    {
        public string Capacity { get; set; }
        public string OpeningTime { get; set; }
        public string ClosingTime { get; set; }
        public bool MondayClosed { get; set; }
        public bool TuesdayClosed { get; set; }
        public bool WednesdayClosed { get; set; }
        public bool ThursdayClosed { get; set; }
        public bool FridayClosed { get; set; }
        public bool SaturdayClosed { get; set; }
        public bool SundayClosed { get; set; }
    }
}
