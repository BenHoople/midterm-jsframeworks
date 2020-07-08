// You need to define the schema for a reservation
// The fields you require are:
// associated user
// quantity of guests
// restaurant name
// date and time of reservation (you can do these as separate fields if you wish) 

const mongoose = require('mongoose');

const ReservationScema = new mongoose.Schema({
  user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
  },
  restaurant:{
      type: String,
      enunm: ["Kelseys", "Montanas", "Outbacks", "Harveys", "Swiss-Chalet"],
      required: true 
  },
  dateAndTime:{
      type: String,
      required: true
  },
  quantityOfGuests:{
    type: Number,
    required: true
  }
},{
  timestamps: true
});

module.exports = mongoose.models.reservation || mongoose.model('Reservation', ReservationScema);
