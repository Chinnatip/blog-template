// components/BlogList.test.tsx
import { render, screen } from '@testing-library/react';
import { useStore } from '@/lib/store'
import BlogList from './BlogList';


describe('BlogList Component', () => {
  beforeEach(() => {
    // Reset store state before each test
    useStore.setState({ posts: [] });
  });

  it('renders no posts message when there are no posts', () => {
    render(<BlogList />);
    expect(screen.getByText('No posts available')).toBeInTheDocument();
  });

  it('renders posts when there are posts', () => {
    // Set the store state with sample posts
    useStore.setState({
      posts: [{ id: 1, title: 'Sample Post', content: 'Sample Content' }],
    });

    render(<BlogList />);
    expect(screen.getByText('Sample Post')).toBeInTheDocument();
  });
});

