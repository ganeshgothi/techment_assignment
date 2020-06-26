import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      loading:false,
      page: 0
    };
  }

  onPaginatedSearch = () => {
    let This = this;
    This.setState({loading:true})
    fetch("https://hn.algolia.com/api/v1/search_by_date?tags=story&page=" + This.state.page)
        .then(response => response.json())
        .then(data => {
          //console.log("api response data>>>"data);
          This.setState({ data: This.state.data.concat(data.hits),loading:false,page:This.state.page+1 })
          /// this.state.data.concat(data.hits)
        });
  }

  componentDidMount() {
    let self = this;
    // Periodically (every 10 seconds) poll for new posts from this API https://hn.algolia.com/api/v1/search_by_date?tags=story&page=0 via a GET request.
    setInterval(() => {
      self.setState({loading:true})
      fetch("https://hn.algolia.com/api/v1/search_by_date?tags=story&page=" + self.state.page)
        .then(response => response.json())
        .then(data => {
          //console.log("api response data>>>"data);
          self.setState({ data: self.state.data.concat(data.hits),loading:false,page:self.state.page+1 })
          /// this.state.data.concat(data.hits)
        });
      
    }, 10000);
    window.addEventListener('scroll', this.onScroll, false);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll, false);
  }

  onScroll = () =>{
   if((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 500)){
    !this.state.loading  && this.onPaginatedSearch();
   }
      
  }
    



  render() {
    let { data } = this.state;
    // To change the loading icon behavior
    const loadingTextCSS = { display: this.state.loading ? "block" : "none" };

    //console.log("render data>>>",data)
    return (
      <div className="container">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <th>Title</th>
              <th>URL</th>
              <th>Created At</th>
              <th>Author</th>
            </thead>
            <tbody>
              {/* Display the title, URL, created_at, and author of each post in a table. */}
              {data && data.map((val, index) => (
                <tr>
                  <td>{val.title}</td>
                  {/* Insted showing the json data, it's redirecting to the url into new tab */}
                  <td><a target="_blank" href={val.url}>{val.url}</a></td>
                  <td>{val.created_at}</td>
                  <td>{val.author}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>

        <div className="loadingCSS">
          <span style={loadingTextCSS} className="loadingTextCSS">Loading...</span>
        </div>

      </div>
    );

  }

}

export default App;
