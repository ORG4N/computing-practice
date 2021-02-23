﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IO;
using doki_doki_delight_management_system.Models;

namespace doki_doki_delight_management_system.Services
{
    public class BookingService
    {
        private static List<Booking> data = new List<Booking>();
        public static Settings settings;
        public static int count;
        public static string UserID;

        public static void Init()
        {
            BookingService service = new BookingService();

            List<string> lines = new List<string>();


            try
            {
                using (FileStream fs = File.Open("wwwroot/data/Bookings.csv", FileMode.Open, FileAccess.Read))
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

                Booking booking = new Booking();

                booking.BookingID = split[0];
                booking.UserID = split[1];
                booking.Occupants = split[2];
                booking.Date = split[3];
                booking.Time = split[4].Replace("/r", "");

                data.Add(booking);
            }

            // Read the ID count from json file
            settings = SettingsService.GetSettings();
            count = settings.BookingID;
        }

        // Used to return all booking objects
        public static List<Booking> GetData()
        {
            return data;
        }

        // Write the data back to the csv file
        public static void PushData(Booking booking)
        {
            data.Add(booking);
            WriteData();

        }

        public static void Delete(string id)
        {
            Booking toDelete = null;
            foreach(Booking booking in data)
            {
                if (booking.BookingID == id)
                {
                    toDelete = booking;
                }
            }

            if (toDelete != null)
            {
                if (data.Count > 1) { data.Remove(toDelete); }
                else { data.Clear(); }


                WriteData();
            }

        }

        private static void WriteData()
        {
            try
            {
                using (FileStream fs = File.Open("wwwroot/data/Bookings.csv", FileMode.Create, FileAccess.Write))
                {
                    using (StreamWriter sw = new StreamWriter(fs))
                    {
                        foreach (Booking element in data)
                        {
                            sw.WriteLine($"{ element.BookingID.Trim()},{ element.UserID.Trim()},{ element.Occupants.Trim()},{ element.Date.Trim()},{ element.Time.Trim()}");
                        }
                    }
                }
            }

            catch (IOException) { }
        }


        // Calculate the ID of each booking object and putting it into an 8 digit format
        public string SetBookingID()
        {
            string format = "00000000";
            string id = count.ToString(format);
            count++;

            SettingsService.UpdateID(count, "BookingID");

            return id;
        }

        public string GetUserID()
        {
            string id = UserID;

            return id;
        }
    }
}
