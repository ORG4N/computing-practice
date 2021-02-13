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
        public static int count = 0;


        // Initialise a list of users by reading them from the csv file
        public static void Init()
        {
            UsersService service = new UsersService();

            StreamReader reader = new StreamReader("wwwroot/data/Users.csv");
            List<string> lines = new List<string>();

            while (!reader.EndOfStream) 
            { 
                lines.Add(reader.ReadLine());
            }

            reader.Close();
            reader.Dispose();


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
        }


        // Used to return all user objects
        public static List<User> GetData()
        {
            return data;
        }

        // Write the data back to the csv file
        public static void PushData(User user)
        {
            data.Add(user);

            StreamWriter writer = new StreamWriter("wwwroot/data/Users.csv");

            foreach (User element in data)
            {
                writer.WriteLine($"{ element.UserID},{ element.Role},{ element.Forename},{ element.Surname},{ element.Email},{ element.Tel}");
            }

            writer.Flush();
            writer.Close();
            writer.Dispose();
        }

        // Calculate the ID of each user object and putting it into an 8 digit format
        public string SetID()
        {
            string format = "00000000";
            string id = count.ToString(format);
            count++;

            return id;
        }
    }
}
