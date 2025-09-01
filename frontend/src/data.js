// data.js
const data = {
    id: 1,
    start: 0,
    end: 30,
    percentStart: 0,
    percentEnd: 100,
    color: "#000000",
    children: [
      {
        id: 10,
        start: 0,
        end: 10,
        percentStart: 0,
        percentEnd: 100,
        color: "#FF7F0E",
        children: [
          {
            id: 101,
            start: 2,
            end: 6,
            percentStart: 6.7,
            percentEnd: 100,
            color: "#FFB870",
            children: [
              {
                id: 1011,
                start: 3,
                end: 5,
                percentStart: 10,
                percentEnd: 100,
                color: "#FFE0C2",
                children: []
              }
            ]
          },
          {
            id: 102,
            start: 6,
            end: 9,
            percentStart: 20,
            percentEnd: 30,
            color: "#FFB870",
            children: []
          }
        ]
      },
      {
        id: 20,
        start: 10,
        end: 20,
        percentStart: 33.3,
        percentEnd: 66.7,
        color: "#1F77B4",
        children: [
          {
            id: 201,
            start: 12,
            end: 16,
            percentStart: 40,
            percentEnd: 53.3,
            color: "#6BAED6",
            children: [
              {
                id: 2011,
                start: 13,
                end: 15,
                percentStart: 43.3,
                percentEnd: 50,
                color: "#C6DBEF",
                children: []
              }
            ]
          },
          {
            id: 202,
            start: 16,
            end: 19,
            percentStart: 53.3,
            percentEnd: 63.3,
            color: "#6BAED6",
            children: []
          }
        ]
      },
      {
        id: 30,
        start: 20,
        end: 30,
        percentStart: 66.7,
        percentEnd: 100,
        color: "#2CA02C",
        children: [
          {
            id: 301,
            start: 22,
            end: 26,
            percentStart: 73.3,
            percentEnd: 86.7,
            color: "#98DF8A",
            children: [
              {
                id: 3011,
                start: 23,
                end: 25,
                percentStart: 76.7,
                percentEnd: 83.3,
                color: "#D5F5E3",
                children: []
              }
            ]
          },
          {
            id: 302,
            start: 26,
            end: 29,
            percentStart: 86.7,
            percentEnd: 96.7,
            color: "#98DF8A",
            children: []
          }
        ]
      }
    ]
  };
  
  export default data;
  