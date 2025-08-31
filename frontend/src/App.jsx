export default function App() {
  return <>
    <Tree node={data} />
  </>
}

function Tree({ node }) {
  if (!node){
    return null;
  }
  return <div style={{ border: "1px solid darkblue", flex: 1, display: "flex", height: "100vh" }}>
    { node.children.map((child) => {
      return <Tree key={child.id} node={child} />
    }) }
  </div>
}

const data = {
  "id": 1,
  "children": [
    {
      "id": 2,
      "children": [
        {
          "id": 3,
          "children": []
        },
        {
          "id": 4,
          "children": [
            {
              "id": 5,
              "children": []
            },
            {
              "id": 6,
              "children": [
                {
                  "id": 7,
                  "children": []
                },
                {
                  "id": 8,
                  "children": []
                }
              ]
            },
            {
              "id": 9,
              "children": []
            }
          ]
        }
      ]
    },    
    {
      "id": 10,
      "children": [
        {
          "id": 11,
          "children": []
        },
        {
          "id": 12,
          "children": []
        }
      ]
    }
  ]
}
