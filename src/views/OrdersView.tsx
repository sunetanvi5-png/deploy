import React, { useState } from 'react'
import {
  ReceiptText,
  ShieldCheck,
  CheckCircle,
  FileDown,
  Clock,
  Truck,
  IndianRupee,
  Building,
  Check,
  ArrowUpRight,
  Printer,
  Sparkles,
} from 'lucide-react'
import type { Language, OrderTransaction, FarmerProfile } from '../types'
import { getTranslation } from '../i18n/translations'

interface OrdersViewProps {
  language: Language
  orders: OrderTransaction[]
  farmerProfile: FarmerProfile
  onShowNotice: (msg: string) => void
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  language,
  orders,
  farmerProfile,
  onShowNotice,
}) => {
  const t = (key: string) => getTranslation(language, key)

  const [selectedInvoice, setSelectedInvoice] = useState<OrderTransaction | null>(null)

  const totalSettled = orders
    .filter((o) => o.status === 'completed')
    .reduce((sum, o) => sum + o.totalAmount, 0)
  const totalInEscrow = orders
    .filter((o) => o.status !== 'completed')
    .reduce((sum, o) => sum + o.totalAmount, 0)

  const handleDownloadInvoice = (order: OrderTransaction) => {
    setSelectedInvoice(order)
  }

  return (
    <div className="view-page-container">
      {/* Page Header Banner */}
      <div className="page-header-row">
        <div>
          <p className="eyebrow">
            <ReceiptText size={13} /> {t('ordersPayments').toUpperCase()} • ESCROW & DBT SETTLEMENTS
          </p>
          <h1>{t('ordersPayments')}</h1>
          <p className="subhead">
            Track deal execution, weighbridge verification, electronic gate passes, and direct bank transfers.
          </p>
        </div>

        <div className="payout-bank-pill">
          <Building size={16} />
          <div>
            <span>Linked Payout Bank</span>
            <strong>{farmerProfile.bankName} ({farmerProfile.accountMasked})</strong>
          </div>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="orders-metrics-grid">
        <div className="order-stat-card">
          <div className="stat-icon-wrap green-icon">
            <IndianRupee size={20} />
          </div>
          <div>
            <span>Total Completed Settlements</span>
            <strong>₹{totalSettled.toLocaleString('en-IN')}</strong>
            <small>Directly credited to SBI A/c</small>
          </div>
        </div>

        <div className="order-stat-card">
          <div className="stat-icon-wrap orange-icon">
            <ShieldCheck size={20} />
          </div>
          <div>
            <span>Funds Secured in Escrow</span>
            <strong className="text-orange">₹{totalInEscrow.toLocaleString('en-IN')}</strong>
            <small>Guaranteed payout on weighment</small>
          </div>
        </div>

        <div className="order-stat-card">
          <div className="stat-icon-wrap blue-icon">
            <ReceiptText size={20} />
          </div>
          <div>
            <span>Total Deal Transactions</span>
            <strong>{orders.length} Contracts</strong>
            <small>100% dispute-free record</small>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="orders-list-wrapper">
        <div className="orders-section-head">
          <h3>Your Contract Orders & Gate Passes</h3>
          <span className="live-pill">
            <span className="live-dot" /> Live Escrow Tracking
          </span>
        </div>

        <div className="orders-cards-stack">
          {orders.map((order) => {
            const isDone = order.status === 'completed'
            return (
              <div key={order.id} className={`order-card ${order.status}`}>
                {/* Order Top Bar */}
                <div className="order-card-header">
                  <div className="order-id-group">
                    <span className="order-code-badge">{order.orderCode}</span>
                    <div>
                      <h4>{order.buyerName}</h4>
                      <p>
                        {order.crop} ({order.grade}) • {order.quantity} {order.unit}
                      </p>
                    </div>
                  </div>

                  <div className="order-amount-group">
                    <span className="rate-text">Rate: ₹{order.ratePerQtl}/qtl</span>
                    <strong className="total-deal-text">
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </strong>
                    <span className={`payment-status-badge ${isDone ? 'done' : 'escrow'}`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Timeline Process Tracker */}
                <div className="order-stepper-timeline">
                  <div className="step-point completed">
                    <div className="point-dot">
                      <Check size={12} />
                    </div>
                    <span>Deal Agreement</span>
                    <small>{order.orderDate}</small>
                  </div>

                  <div className={`step-line ${order.status !== 'confirmed' ? 'active' : ''}`} />

                  <div className={`step-point ${order.status !== 'confirmed' ? 'completed' : 'pending'}`}>
                    <div className="point-dot">
                      {order.status !== 'confirmed' ? <Check size={12} /> : <Clock size={12} />}
                    </div>
                    <span>Escrow Locked</span>
                    <small>100% Deposit</small>
                  </div>

                  <div className={`step-line ${isDone ? 'active' : ''}`} />

                  <div className={`step-point ${isDone ? 'completed' : 'pending'}`}>
                    <div className="point-dot">
                      {isDone ? <Check size={12} /> : <Truck size={12} />}
                    </div>
                    <span>Weighment & Pickup</span>
                    <small>{order.pickupDate}</small>
                  </div>

                  <div className={`step-line ${isDone ? 'active' : ''}`} />

                  <div className={`step-point ${isDone ? 'completed' : 'pending'}`}>
                    <div className="point-dot">
                      {isDone ? <Check size={12} /> : <IndianRupee size={12} />}
                    </div>
                    <span>DBT Payout Credited</span>
                    <small>{isDone ? 'Completed' : 'Pending Weighment'}</small>
                  </div>
                </div>

                {/* Order Footer Actions */}
                <div className="order-card-footer">
                  <div className="order-meta-dates">
                    <span>Order Date: <strong>{order.orderDate}</strong></span>
                    <span>Expected Dispatch: <strong>{order.pickupDate}</strong></span>
                    <span>Invoice Ref: <strong>{order.invoiceNumber}</strong></span>
                  </div>

                  <div className="order-actions-right">
                    <button
                      className="btn-order-slip"
                      onClick={() =>
                        onShowNotice(`Viewing Weighbridge Slip for order ${order.orderCode}`)
                      }
                    >
                      <ReceiptText size={14} />
                      <span>Weigh Slip</span>
                    </button>

                    <button
                      className="btn-order-invoice"
                      onClick={() => handleDownloadInvoice(order)}
                    >
                      <FileDown size={14} />
                      <span>Download Receipt</span>
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Invoice / Receipt View Modal */}
      {selectedInvoice && (
        <div className="modal-overlay" onClick={() => setSelectedInvoice(null)}>
          <div className="modal-container invoice-modal" onClick={(e) => e.stopPropagation()}>
            <div className="invoice-paper">
              <div className="invoice-header">
                <div className="invoice-brand">
                  <h2>Kisan<span>Setu</span></h2>
                  <p>National Electronic Agricultural Market Settlement Slip</p>
                </div>
                <div className="invoice-code">
                  <strong>TAX INVOICE / SALE RECEIPT</strong>
                  <span>Invoice: {selectedInvoice.invoiceNumber}</span>
                  <span>Date: {selectedInvoice.orderDate}</span>
                </div>
              </div>

              <div className="invoice-parties-grid">
                <div className="party-box">
                  <span className="party-role">SELLER (FARMER):</span>
                  <strong>{farmerProfile.name}</strong>
                  <p>{farmerProfile.village}, {farmerProfile.district}, {farmerProfile.state}</p>
                  <p>Kisan Card: {farmerProfile.kisanCardNumber}</p>
                  <p>Bank: {farmerProfile.bankName} ({farmerProfile.accountMasked})</p>
                </div>

                <div className="party-box">
                  <span className="party-role">BUYER (PROCESSOR):</span>
                  <strong>{selectedInvoice.buyerName}</strong>
                  <p>Corporate Sourcing Partner</p>
                  <p>Settlement Gateway: KisanSetu Escrow Trust</p>
                </div>
              </div>

              <table className="invoice-table">
                <thead>
                  <tr>
                    <th>Commodity</th>
                    <th>Grade</th>
                    <th>Quantity</th>
                    <th>Rate / Qtl</th>
                    <th>Total Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{selectedInvoice.crop}</td>
                    <td>{selectedInvoice.grade}</td>
                    <td>{selectedInvoice.quantity} {selectedInvoice.unit}</td>
                    <td>₹{selectedInvoice.ratePerQtl.toLocaleString('en-IN')}</td>
                    <td><strong>₹{selectedInvoice.totalAmount.toLocaleString('en-IN')}</strong></td>
                  </tr>
                </tbody>
              </table>

              <div className="invoice-total-section">
                <div className="inv-row">
                  <span>Gross Crop Value:</span>
                  <strong>₹{selectedInvoice.totalAmount.toLocaleString('en-IN')}</strong>
                </div>
                <div className="inv-row">
                  <span>Mandi Platform Fee:</span>
                  <strong className="text-green">₹0 (Waived for Farmer)</strong>
                </div>
                <div className="inv-row grand-total">
                  <span>Net Direct DBT Payout:</span>
                  <strong>₹{selectedInvoice.totalAmount.toLocaleString('en-IN')}</strong>
                </div>
              </div>

              <div className="invoice-footer-stamp">
                <div className="digital-stamp">
                  <ShieldCheck size={20} />
                  <div>
                    <strong>KISANSETU DIGITALLY VERIFIED</strong>
                    <small>Payment guaranteed by Banking Escrow</small>
                  </div>
                </div>
                <p>This is a computer-generated tax and sale certificate.</p>
              </div>

              <div className="modal-actions no-print">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setSelectedInvoice(null)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    window.print()
                    onShowNotice('Printing invoice receipt...')
                  }}
                >
                  <Printer size={16} /> Print Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
