import * as React from "react";
import { Observable, Subject } from "rxjs";
import { switchMap } from "rxjs/operators";

class ImagePreloader extends React.Component {
  state = {
    ready: false,
    src: null,
  };

  subject = new Subject();

  componentDidMount() {
    this.subscription = this.subject
      .pipe(
        switchMap(src =>
          Observable.create(observer => {
            const img = new Image();

            // Attach callback to observer
            img.onload = () => {
              observer.next(src);
              observer.complete();
            };

            // Load the image
            img.src = src;

            return () => {
              // Cancel loading on unsubscribe
              img.src = "";
            };
          })
        )
      )
      .subscribe(src => {
        this.setState({
          ready: true,
          src,
        });
      });

    this.subject.next(this.props.src);
  }

  componentDidUpdate(prevProps) {
    if (this.props.src !== prevProps.src) {
      this.subject.next(this.props.src);
    }
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  render() {
    const { ready, src } = this.state;

    if (!ready) {
      return this.props.loading;
    }

    return this.props.children({ src });
  }
}

export default ImagePreloader;
