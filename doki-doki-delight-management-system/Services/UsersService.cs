using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using doki_doki_delight_management_system.Models;

namespace doki_doki_delight_management_system.Services
{
    public class UsersService
    {
        private static List<User> data = new List<User>();

        public static void Init()
        {
            string[] file = System.IO.File.ReadAllText("wwwroot/data/Users.csv").Split("\n");

            foreach (string line in file)
            {
                string[] split = line.Split(',');

                User user = new User();
                user.Role = split[0];
                user.Forename = split[1];
                user.Surname = split[2];
                user.Email = split[3];
                user.Tel = split[4].Replace("/r", "");

                data.Add(user);
            }
        }

        public static List<User> GetData()
        {
            return data;
        }
    }
}
