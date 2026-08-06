import {
  SidebarContent,
  type SidebarContentProps,
} from '@/components/sidebar/sidebar-content'
import { render, screen } from '@/lib/test-utils'
import userEvent from '@testing-library/user-event'

const initialProps: SidebarContentProps = {
  prompts: [
    {
      id: '1',
      title: 'Example 1',
      content: 'Content 1',
    },
  ],
}

const pushMock = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}))

function renderElement({ prompts }: SidebarContentProps = initialProps) {
  render(<SidebarContent prompts={prompts} />)
}

describe('SidebarContent', () => {
  const user = userEvent.setup()

  describe('Base', () => {
    it('Should render new prompt button', () => {
      renderElement()

      expect(screen.getByRole('button', { name: 'Novo prompt' })).toBeVisible()
    })

    it('Should render prompt list', () => {
      const props: SidebarContentProps = {
        prompts: [
          {
            id: '1',
            title: 'Example 1',
            content: 'Content 1',
          },
          {
            id: '2',
            title: 'Example 2',
            content: 'Content 2',
          },
        ],
      }

      renderElement(props)

      expect(screen.getAllByRole('paragraph')).toHaveLength(
        props.prompts.length
      )
      expect(screen.getByText(props.prompts[0].title)).toBeInTheDocument()
    })

    it('Should update the search field as you typed', async () => {
      renderElement()
      const text = 'text'
      const searchInput = screen.getByPlaceholderText('Buscar prompts...')

      await user.type(searchInput, text)

      expect(searchInput).toHaveValue(text)
    })
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
