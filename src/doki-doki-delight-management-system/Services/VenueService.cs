using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IO;
using Newtonsoft.Json;
using doki_doki_delight_management_system.Models;

namespace doki_doki_delight_management_system.Services
{
    public class VenueService
    {
        public static Venue venue;
        private static List<Venue> data = new List<Venue>();

        public static void Init()
        {
            try
            {
                using (FileStream fs = File.Open("wwwroot/data/venue.json", FileMode.Open, FileAccess.Read))
                {
                    using (StreamReader sr = new StreamReader(fs))
                    {
                        var jsonVenue = sr.ReadToEnd();
                        venue = JsonConvert.DeserializeObject<Venue>(jsonVenue);
                        data.Add(venue);
                    }
                }
            }

            catch (IOException) { }
        }

        public static void PushData(Venue venue)
        {
            data.Clear();
            data.Add(venue);

            string output = JsonConvert.SerializeObject(venue, Formatting.Indented);

            try
            {
                using (FileStream fs = File.Open("wwwroot/data/venue.json", FileMode.Create, FileAccess.Write))
                {
                    using (StreamWriter sw = new StreamWriter(fs))
                    {
                        sw.WriteAsync(output);
                    }
                }
            }

            catch (IOException) { }
        }

        // Return Settings but just in List format
        public static List<Venue> GetData()
        {
            return data;
        }

    }
}
