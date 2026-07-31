import { SidebarContent } from '@/components/sidebar/sidebar-content'
import { render, screen } from '@/lib/test-utils'
import userEvent from '@testing-library/user-event'

const pushMock = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}))

function renderElement() {
  render(<SidebarContent />)
}

describe('SidebarContent', () => {
  const user = userEvent.setup()

  it('Should render new prompt button', () => {
    renderElement()

    expect(screen.getByRole('button', { name: 'Novo prompt' })).toBeVisible()
  })

  describe('Collapse / Expand', () => {
    it('Should start in expanded mode and display the minimize button', () => {
      renderElement()

      const aside = screen.getByRole('complementary')
      expect(aside).toBeVisible()

      const collapseButton = screen.getByRole('button', {
        name: /minimizar sidebar/i,
      })
      expect(collapseButton).toBeVisible()

      const expandButton = screen.queryByRole('button', {
        name: /expandir sidebar/i,
      })
      expect(expandButton).not.toBeInTheDocument()
    })

    it('Should minimize and display the expand button', async () => {
      renderElement()

      const collapseButton = screen.getByRole('button', {
        name: /minimizar sidebar/i,
      })

      await user.click(collapseButton)

      const expandButton = screen.queryByRole('button', {
        name: /expandir sidebar/i,
      })
      expect(expandButton).toBeVisible()

      expect(collapseButton).not.toBeInTheDocument()
    })
  })

  describe('New Prompt', () => {
    it('Should redirect the user to the new prompt page (/new)', async () => {
      renderElement()

      const newButton = screen.getByRole('button', {
        name: 'Novo prompt',
      })

      await user.click(newButton)

      expect(pushMock).toHaveBeenCalledWith('/new')
    })
  })
})
