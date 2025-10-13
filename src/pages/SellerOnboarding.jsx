import { useEffect } from 'react'
import Page from '../components/Page'
import { useAuth } from '../context/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'

export default function SellerOnboarding() {
  const { user, role, ensureRoleDoc, sellerActive, loading } = useAuth()
  const nav = useNavigate()
  const loc = useLocation()

  useEffect(() => {
    if (loading) return
    if (!user) {
      nav('/seller/login', { replace: true, state: { from: loc } })
      return
    }
    // Make sure they have a seller role doc
    ensureRoleDoc('seller').then(() => {
      if (sellerActive) nav('/seller/dashboard', { replace: true })
      else nav('/seller/start', { replace: true })
    })
  }, [user, loading, sellerActive])

  return <Page title="Seller Onboarding" />
}
