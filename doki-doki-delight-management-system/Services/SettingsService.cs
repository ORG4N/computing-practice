using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IO;
using Newtonsoft.Json;
using doki_doki_delight_management_system.Models;

namespace doki_doki_delight_management_system.Services
{
    public class SettingsService
    {
        public static Settings settings;

        public static void UpdateID(int count, string id)
        {
            if (id == "UserID") { settings.UserID = count; }
            else if (id == "BookingID") { settings.BookingID = count; }

            string output = JsonConvert.SerializeObject(settings, Formatting.Indented);

            try
            {
                using (FileStream fs = File.Open("wwwroot/data/settings.json", FileMode.Open, FileAccess.Write))
                {
                    using (StreamWriter sw = new StreamWriter(fs))
                    {
                        sw.WriteAsync(output);
                    }
                }
            }

            catch (IOException) { }
        }

        public static Settings GetSettings()
        {
            try
            {
                using (FileStream fs = File.Open("wwwroot/data/settings.json", FileMode.Open, FileAccess.Read))
                {
                    using (StreamReader sr = new StreamReader(fs))
                    {
                        var jsonSettings = sr.ReadToEnd();
                        settings = JsonConvert.DeserializeObject<Settings>(jsonSettings);
                    }
                }
            }

            catch (IOException) { }

            return settings;
        }
    }
}
