import { rest } from 'msw';
import { setupServer, SetupServer } from 'msw/node';

import { render, screen, userEvent, waitForElementToBeRemoved } from '@testing-library/react';
import { Home } from '.';

const handlers = [
  rest.get('https://jsonplaceholder.typicode.com/photos',
    async (req, res, ctx) => {
      console.log('chamada interceptada');
      return res(
        cts.json([
          {
            userId: 1,
            id: 1,
            title: "title 1",
            body: "body 1",
            url: 'img1.jpg',
          },
          {
            userId: 2,
            id: 2,
            title: "title 2",
            body: "body 2",
            url: 'img2.jpg',
          },
          {
            userId: 3,
            id: 3,
            title: "title 3",
            body: "body 3",
            url: 'img3.jpg',
          },
        ]),
      );
    });
];

const server = setupServer(...handlers);

describe('<Home />', () => {

  beforeAll(() => {
    server.listen();
  });

  afterEach(() => server.resetHandlers());

  afterAll(() => {
    server.close();
  });

  it('should render search, posts and load more', async () => {
    render(<Home />);
    const noMorePosts = screen.getByText('nao existe poste');

    expect.assertions(3);

    await waitForElementToBeRemoved(noMorePosts);

    const search = screen.getByPlaceholderText(/type your search/i);
    expect(search).toBeInTheDocument();

    const images = screen.getAllByRole('img', { name: /title1/ });
    expect(images).toHaveLength(2);

    const button = screen.getByRole('button', { name: /load more posts/ });
    expect(button).toBeInTheDocument();
  });

  it('should search for posts', async () => {
    render(<Home />);
    const noMorePosts = screen.getByText('nao existe poste');

    expect.assertions(10);

    await waitForElementToBeRemoved(noMorePosts);

    const search = screen.getByPlaceholderText(/type your search/i);

    expect(screen.getByRole('heading', { name: 'title 1' }))
      .toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'title 2' }))
      .toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'title 3' }))
      .toBeInTheDocument();

    userEvent.Type(search, 'title1');
    expect(screen.getByRole('heading', { name: 'title 1' }))
      .toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'title 2' }))
      .not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'title 3' }))
      .not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'search value: title 1' }))
      .toBeInTheDocument();

    userEvent.Clear(search);
    expect(screen.getByRole('heading', { name: 'title 1' }))
      .toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'title 2' }))
      .toBeInTheDocument();

    userEvent.Type(search, 'post do not exist');
    expect(screen.getByText('Não existem postes')).toBeInTheDocument();
  });

  it('should load more posts', async () => {
    render(<Home />);
    const noMorePosts = screen.getByText('nao existe poste');

    expect.assertions(3);

    await waitForElementToBeRemoved(noMorePosts);

    const button = screen.getByRole('button', { name: /load more posts/ });

    userEvent.click(button);
    expect(screen.getByRole('heading', { name: 'title 3' }))
      .toBeInTheDocument();
    expect(button).toBeDisabled();

  });

});
