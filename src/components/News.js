import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

export class News extends Component {
  static defaultProps = {
    country: "in",
    pageSize: 9,
    category: "general",
    news: "Top headlines",
  };

  static propTypes = {
    country: PropTypes.string,
    pagesize: PropTypes.number,
    category: PropTypes.string,
    news: PropTypes.string,
  };

  constructor() {
    super();
    this.state = {
      articles: [],
      loading: false,
      page: 1,
      totalResults:0
    };
  }
  fetchMoreData = async () => {  
        const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.api}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
        let data = await fetch(url);
        let parsedData = await data.json()
        this.setState({page: this.state.page + 1})
        this.setState({
            articles: this.state.articles.concat(parsedData.articles),
            totalResults: parsedData.totalResults
        })
      };

  async updateNews() {
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.api}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    let data = await fetch(url);
    let parsedData = await data.json()
    this.setState({
        articles: parsedData.articles,
        totalResults: parsedData.totalResults,
    })

}
async componentDidMount() {
    this.updateNews();
}

//   handlePrevClick = async () => {
//     this.setState({ page: this.state.page - 1 });
//     this.updateNews();
//   };

//   handleNextClick = async () => {
//     this.setState({ page: this.state.page + 1 });
//     this.updateNews();
//   };

  render() {
    return (
      <>
        <h1 className="text-center" style={{ margin: "20px 0px" , marginTop:"90px"}}>
          Today's {this.props.news}
        </h1>
        {this.state.loading && <Spinner />}
        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length !== this.state.totalResults}
        //   loader={<Spinner/>}
        >
          <div className="container">
            <div className="row">
              {!this.state.loading &&
                this.state.articles.map((element) => {
                  return (
                    <div className="col-md-4" key={element.url}>
                      <NewsItem
                        title={element.title ? element.title.slice(0, 60) : ""}
                        description={
                          element.description
                            ? element.description.slice(0, 90)
                            : element.title
                        }
                        imageUrl={
                          element.urlToImage
                            ? element.urlToImage
                            : "https://static01.nyt.com/images/2023/06/27/science/27SCI-problemofthrees/27SCI-problemofthrees-facebookJumbo.jpg"
                        }
                        newsUrl={element.url}
                        author={element.author ? element.author : "Anonymous"}
                        time={element.publishedAt}
                        source={element.source.name}
                      />
                    </div>
                  );
                })}
            </div>
          </div>
        </InfiniteScroll>
        {/* <div className="container d-flex justify-content-between">
          <button
            disabled={this.state.page <= 1}
            type="button"
            className="btn btn-dark"
            onClick={this.handlePrevClick}
          >
            {" "}
            &larr; Previous
          </button>
          <button
            disabled={
              this.state.page + 1 >
              Math.ceil(this.state.totalResults / this.props.pageSize)
            }
            type="button"
            className="btn btn-dark"
            onClick={this.handleNextClick}
          >
            Next &rarr;
          </button>
        </div> */}
      </>
    );
  }
}

export default News;