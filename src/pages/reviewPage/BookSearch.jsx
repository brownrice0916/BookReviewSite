import React, { useState } from 'react';
import axios from 'axios';
import { IoSearchSharp } from 'react-icons/io5';
import styled from 'styled-components';

function BookSearch({ setSelectedBook, books, setBooks }) {
  const [query, setQuery] = useState('');

  const searchBooks = async () => {
    try {
      // cors 문제로 vercel serverless function에 요청해서 naver-api data 가져옴
      const response = await axios.get(`/api/naver-api`, {
        params: {
          query: query,
          display: 8 // 가져올 검색 결과의 수
        }
      });

      setBooks(response.data.items);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    searchBooks();
  };

  return (
    <StyledBookSearchContainer>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="찾을 도서를 입력해 주세요."
          className="searchInput"
          type="text"
          value={query}
          onChange={handleInputChange}
        />
        <button type="submit" className="search_icon">
          <IoSearchSharp size="20px" />
        </button>
      </form>
      <StyledBookSearchList>
        {books.length > 0 ? (
          <ul>
            {books.map((book, index) => (
              <li
                key={index}
                onClick={() => {
                  setSelectedBook(book);
                  setBooks([]);
                }}
              >
                <img src={book.image} alt={book.title} />
                <p>제목:{book.title}</p>
                <p>저자:{book.author}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>검색 결과가 없습니다.</p>
        )}
      </StyledBookSearchList>
    </StyledBookSearchContainer>
  );
}

export default BookSearch;

const StyledBookSearchContainer = styled.div`
  width: 400px;
  height: 420px;
  margin: 0 auto;
  text-align: center;
  overflow: hidden;
  button {
    background-color: transparent;
    border: none;
  }
  .search_icon {
    cursor: pointer;
  }
  > form {
    // margin-bottom: 20px;
    display: flex;
    justify-content: center;
  }
  .searchInput {
    margin-right: 10px;
    width: 60%;
    border: none;
    border-bottom: 1px solid ${(props) => props.theme.colors.mainBlack};
  }
`;

const StyledBookSearchList = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;

  > ul {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    align-items: center;
    > li {
      list-style: none;
      width: 90px;
      cursor: pointer;
      overflow: hidden;
      white-space: nowrap;
      > img {
        width: 100%;
        height: 130px;
        margin-bottom: 10px;
      }
      > p {
        text-overflow: ellipsis;
        overflow: hidden;
        text-align: left;
        font-size: ${(props) => props.theme.fontSize.xs};
        margin-bottom: 5px;
      }
    }
  }
`;
