// You need to complete this controller with the required 7 actions

const viewPath = 'reservations';
const Reservation = require('../models/reservation');
const User = require('../models/user');

exports.index = async (req, res) => {
    try{
        console.log("we're at the index now baby");
        const reservations = await Reservation.find().populate('user').sort({updatedAt: 'desc'});
        res.render(`${viewPath}/index`, {
            pageTitle: 'Reservations',
            reservations: reservations
        });
    }catch(err){
        req.flash('danger', 'We were unable to get the reservations for some reason.');
        console.error(err);
        res.redirect('/');
    }
}
exports.show = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id)
        .populate('user');
        res.render(`${viewPath}/show`, {
        pageTitle: reservation.title,
        reservation: reservation
    });
    }catch(err){
        req.flash('danger', 'We were unable to display the reservation for some reason.');
        console.error(err);
        res.redirect('/');
    }
}

exports.new = (req,res) => {
    res.render(`${viewPath}/new`, {
        pageTitle: 'Create a Reservation',
        restaurants: ["Kelseys", "Montanas", "Outbacks", "Harveys", "Swiss-Chalet"] 
    });
}


exports.create = async (req, res) => {
    try {
        console.log(req.body);
        console.log(typeof(req.body.dateAndTime));
        //User association
        const { user: email } = await req.session.passport;
        const user = await User.findOne({email: email});//find user
        //create reservation
        const reservation = await Reservation.create({user: user._id, ...req.body});
        req.flash('success', 'Reservation successfully created!');
        res.redirect('/reservations');
    } catch (err) {
      req.flash('danger', `we ran into an issue, heres what it was: ${err}`)
      req.session.formData = req.body;
      res.redirect('/reservations');
  }
}
exports.edit = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        res.render(`${viewPath}/edit`, {
        pageTitle: reservation.title,
        formData: reservation,
        restaurants: ["Kelseys", "Montanas", "Outbacks", "Harveys", "Swiss-Chalet"] 
    });
    }catch(err){
        req.flash('danger', 'We were unable to edit this reservation for some reason, sorry!.');
        console.error("the error is in edit: "+err);
        res.redirect('/');
    }
}
exports.update = async (req, res) => {
    try{
        let reservation = await Reservation.findById(req.body.id);

        console.log(reservation);
        console.log("we're in update");

        if(!reservation) throw new Error("Reservation couldn't be found");
        
        reservation = await Reservation.findByIdAndUpdate(req.body.id, req.body);
        
        req.flash('success', 'The reservation was updated!');
        res.redirect(`/reservations/${req.body.id}`);
    }catch(error){
        req.flash('danger', 'We were unable to update this reservation for some reason, sorry!.');
        console.error("here is the error: "+error);
        res.redirect(`/reservations/${req.body.id}/edit`);
    }
}
exports.delete = async (req, res) => {
    try{

        await Reservation.deleteOne({_id: req.body.id});
        req.flash('success', `Your reservation was cancelled`);
        res.redirect(`/reservations`);
    }catch(error){
        req.flash('danger', 'We were unable to delete this reservation for some reason, sorry!.');
        console.error(error);
        res.redirect(`/reservations/${req.body.id}/edit`);
    }
}