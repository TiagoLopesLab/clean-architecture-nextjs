import { SidebarContent } from '@/components/sidebar/sidebar-content'
import { render, screen } from '@/lib/test-utils'

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}))

describe('SidebarContent', () => {
  it('Should render new prompt button', () => {
    render(<SidebarContent />)

    expect(screen.getByRole('button', { name: 'Novo prompt' })).toBeVisible()
  })
})
