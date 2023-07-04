using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IO;
using doki_doki_delight_management_system.Models;

namespace doki_doki_delight_management_system.Services
{
    public class UsersService
    {
        private static List<User> data = new List<User>();
        public static Settings settings;
        public static int count;


        // Initialise a list of users by reading them from the csv file
        public static void Init()
        {
            UsersService service = new UsersService();
            List<string> lines = new List<string>();


            try
            {
                using (FileStream fs = File.Open("wwwroot/data/Users.csv", FileMode.Open, FileAccess.Read))
                {
                    using (StreamReader sr = new StreamReader(fs))
                    {
                        while (!sr.EndOfStream)
                        {
                            lines.Add(sr.ReadLine());
                        }
                    }
                }
            }

            catch (IOException) { }

            // Create each object by reading each field from each line in from the users.csv file
            foreach (string field in lines)
            {
                string[] split = field.Split(',');

                User user = new User();

                user.UserID = split[0];
                user.Role = split[1];
                user.Forename = split[2];
                user.Surname = split[3];
                user.Email = split[4];
                user.Tel = split[5].Replace("/r", "");

                data.Add(user);
            }

            // Read the ID count from json file
            settings = SettingsService.GetSettings();
            count = settings.UserID;
        }


        // Used to return all user objects
        public static List<User> GetData()
        {
            return data;
        }

        // Push data to the list
        public static void PushData(User user)
        {
            data.Add(user);
            WriteData();
        }

        // Write data back to the csv file
        private static void WriteData()
        {
            try
            {
                using (FileStream fs = File.Open("wwwroot/data/Users.csv", FileMode.Create, FileAccess.Write))
                {
                    using (StreamWriter sw = new StreamWriter(fs))
                    {
                        foreach (User element in data)
                        {
                            sw.WriteLine($"{ element.UserID.Trim()},{ element.Role.Trim()},{ element.Forename.Trim()},{ element.Surname.Trim()},{ element.Email.Trim()},{ element.Tel.Trim()}");
                        }
                    }
                }
            }

            catch (IOException) { }
        }

        // Calculate the ID of each user object and putting it into an 8 digit format
        public string SetUserID()
        {
            string format = "00000000";
            string id = count.ToString(format);

            BookingService.UserID = id;
            count++;
            SettingsService.UpdateID(count, "UserID");

            return id;
        }

        // Update user info by writing it back to the csv
        public static void Amend(User user, string id)
        {
            for (int i = 0; i < data.Count; i++)
            {
                if (id == data[i].UserID)
                {
                    data[i] = user;
                }
            }

            WriteData();
        }
    }
}
