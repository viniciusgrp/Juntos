import PainelLayout from '@/components/painel-layout'

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return <PainelLayout>{children}</PainelLayout>
}
