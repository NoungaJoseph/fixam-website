import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../../services/api';

export default function TransactionHistory() {
  const { i18n } = useTranslation();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchTransactions = async () => {
      try {
        const res = await api.get('/wallet/transactions');
        if (isMounted) {
          setTransactions(res.data?.data || res.data?.transactions || []);
        }
      } catch (err) {
        console.error('Failed to fetch transactions:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchTransactions();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="transaction-history-page animate-fade-in" style={{ padding: '1.25rem', maxWidth: '900px', margin: '0 auto' }}>
      
      {/* Simple Page Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
          {i18n.language === 'fr' ? 'Historique des transactions' : 'Transaction History'}
        </h1>
        <p style={{ fontSize: '0.88rem', color: '#64748B', margin: '4px 0 0' }}>
          {i18n.language === 'fr'
            ? 'Consultez la liste complète de vos transactions récentes'
            : 'View your complete list of recent transactions'}
        </p>
      </div>

      {/* Clean Transactions Table */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '1rem 1.25rem' }}>{i18n.language === 'fr' ? 'Date' : 'Date'}</th>
                <th style={{ padding: '1rem 1.25rem' }}>{i18n.language === 'fr' ? 'Description' : 'Description'}</th>
                <th style={{ padding: '1rem 1.25rem' }}>{i18n.language === 'fr' ? 'Type' : 'Type'}</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>{i18n.language === 'fr' ? 'Montant' : 'Amount'}</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '3rem', color: '#94A3B8' }}>
                    {i18n.language === 'fr' ? 'Chargement des transactions...' : 'Loading transactions...'}
                  </td>
                </tr>
              ) : transactions.length > 0 ? (
                transactions.map((tx, idx) => {
                  const isEarn = tx.type === 'EARN' || tx.type === 'TOP_UP' || tx.amount > 0;
                  return (
                    <tr key={tx.id || tx._id || idx} style={{ borderBottom: '1px solid #F1F5F9', fontSize: '0.9rem' }}>
                      <td style={{ padding: '1rem 1.25rem', color: '#475569', whiteSpace: 'nowrap' }}>
                        {new Date(tx.createdAt || Date.now()).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td style={{ padding: '1rem 1.25rem', color: '#0F172A', fontWeight: 600 }}>
                        {tx.description || tx.reason || (isEarn ? 'Wallet Top-up' : 'Booking Payment')}
                      </td>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '3px 10px',
                          borderRadius: '999px',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          backgroundColor: isEarn ? '#DCFCE7' : '#FEE2E2',
                          color: isEarn ? '#15803D' : '#B91C1C'
                        }}>
                          {isEarn ? (i18n.language === 'fr' ? 'Crédit' : 'Credit') : (i18n.language === 'fr' ? 'Débit' : 'Debit')}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.25rem', textAlign: 'right', fontWeight: 800, color: isEarn ? '#16A34A' : '#DC2626' }}>
                        {isEarn ? `+${tx.amount}` : `-${Math.abs(tx.amount)}`} {i18n.language === 'fr' ? 'pièces' : 'coins'}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#94A3B8' }}>
                    {i18n.language === 'fr' ? 'Aucune transaction enregistrée pour le moment.' : 'No transactions recorded yet.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
