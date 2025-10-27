const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    // Autenticação e Informações Pessoais 
    name:{
        type: String,
        required: [true, 'O nome é um dado obrigatório'],
        trim: true 
    },
    email: {
        type: String, 
        required: [true, 'O email é um dado obrigatório'],
        unique: true, 
        lowercase: true, 
        trim: true,
        // Regex simples para validação de estrutura de e-mail
    match: [/\S+@\S+\.\S+/, 'Por favor, insira um e-mail válido']
    },
    password: {
        type: String,
        // Senha não vai ser um component obrigatório para permitir login pela redes sociais (google, facebook, etc)
    },

    // IDs para Provedores Socias 
    googleId: {
        type:String,
        unique: true, 
        sparse: true
    },
    facebookId: {
        type: String,
        unique: true,
        sparse: true
    },

    // Informações de Perfil e Contato 
    profilePictureUrl: {
        type: String, 
        default: '/images/default-avatar-user.png'
    },
    city: {
        type: String, 
        required: [true, 'A cidade é obrigatória'],
        trim: true
    },   
    state: {
        type: String, 
        required: [true, 'O estado é obrigatório'],
        trim: true
    },
    phoneNumber: {
        type: String,
        trim: true
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },

    // Funcionalidade de favoritos --- linkado com a tabela de pets
    favorites: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Pet'
    }],

    // Perfil e Estilo de Vida (ajuda a fazer o processo de adoção)
    lifestyleProfile: {
    homeType: {
      type: String,
      enum: ['apartamento', 'casa_sem_quintal', 'casa_com_quintal', 'rural']
    },
    activityLevel: {
      type: String,
      enum: ['baixo', 'medio', 'alto'],
      default: 'medio'
    },
    household: {
      hasChildren: { type: Boolean, default: false },
      hasOtherPets: { type: Boolean, default: false },
      otherPetsDetails: [String] // ex: ['cachorro_pequeno', 'gato']
    },
    experience: {
      isFirstTimeOwner: { type: Boolean, default: true },
      canTrain: { type: Boolean, default: false }
    },
    timeSpentAlone: { // Tempo que o pet ficaria sozinho
      type: String,
      enum: ['0-4_horas', '4-8_horas', '8+_horas']
    },
},
  // --- Timestamps Automáticos ---
  // Adiciona 'createdAt' e 'updatedAt' automaticamente
  timestamps: true
});

// --- Exportação ---
module.exports = mongoose.model('User', userSchema);