import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema({
  contactInfo: {
    email: { type: String, default: 'info@chocodelght.com' },
    phone: { type: String, default: '(555) 123-4567' },
    address: {
      street: { type: String, default: '123 Chocolate Avenue' },
      city: { type: String, default: 'Sweet City' },
      state: { type: String, default: 'SC' },
      zipCode: { type: String, default: '12345' }
    }
  },
  aboutPage: {
    title: { type: String, default: 'About ChocoDelight' },
    content: { type: String, default: 'Since 1985, ChocoDelight has been dedicated to creating the finest artisan chocolates...' }
  }
}, {
  timestamps: true
});

export default mongoose.model('SiteSettings', siteSettingsSchema);