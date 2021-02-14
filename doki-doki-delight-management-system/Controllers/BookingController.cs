using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using doki_doki_delight_management_system.Models;
using doki_doki_delight_management_system.Services;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace doki_doki_delight_management_system.Controllers
{
    [Route("api/bookings")]
    [ApiController]
    public class BookingController : ControllerBase
    {
        // GET: api/<BookingController>
        [HttpGet]
        public IEnumerable<Booking> Get()
        {
            return BookingService.GetData().ToArray();
        }

        // POST api/<BookingController>
        [HttpPost]
        public void Post([FromBody] Booking booking)
        {
            BookingService service = new BookingService();
            booking.BookingID = service.SetBookingID();
            booking.UserID = service.GetUserID();
            BookingService.PushData(booking);
        }
    }
}
