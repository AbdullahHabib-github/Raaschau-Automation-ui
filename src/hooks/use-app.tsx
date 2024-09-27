import { useEffect, useState } from 'react';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import { db } from '../utils/firebase';

export type Agreement = {
  id: number;
  subject: string;
  done: boolean;
  appointmentNumber: string;
  AgreementManager: string;
  Real_total_hr: number;
  Real_Montagetimer_hr: number;
  Real_Svendetimer_hr: number;
  Real_Projektering_hr: number;
};

export const useApp = () => {
  const [loading, setLoading] = useState(true);
  const [agreements, setAgreements] = useState<Agreement[]>([]);

  useEffect(() => {
    const getAgreements = async () => {
      try {
        const q = query(
          collection(db, 'agreements'),
          where('done', '==', false),
          limit(10)
        );
        const arr: Agreement[] = [];
        const snapShot = await getDocs(q);
        snapShot.forEach((v) => {
          const data: Agreement = v.data() as Agreement;
          console.log(JSON.stringify(data, null, 2));
          arr.push({
            ...data,
            id: Date.now() + Math.round(Math.random() * 1000),
          });
        });
        setAgreements(arr);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    getAgreements();
  }, []);

  return { agreements, loading };
};
