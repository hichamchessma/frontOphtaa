export interface Patient {
  id: number;
  nom: string;
  prenom: string;
  dateNaissance: Date;
  telephone: string;
  email: string;
  adresse: string;
  numeroSecuriteSociale: string;
  dernierRdv?: Date;
  prochainRdv?: Date;
  antecedents?: string[];
  notes?: string;
}
