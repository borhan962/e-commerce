
import slide1  from '@/assets/images/slider-image-1.jpeg';
import slide2  from '@/assets/images/slider-image-2.jpeg';
import slide3  from '@/assets/images/slider-image-3.jpeg';
import CommonSlider from '@/components/shared/CommonSlider/CommonSlider';


export default function MainSlider() {

  const slides=[
    {
      src:slide1.src,
      label:'slide1'
    },
    {
      src:slide2.src,
      label:'slide2'
    },
    {
      src:slide3.src,
      label:'slide3'
    },
  ]
  return (
    <>
    <div className='container mx-auto'>
      <CommonSlider slides={slides} swiperOptions={{
        pagination:true,
        navigation:true,
        autoplay:{
          delay:5000,
          disableOnInteraction:false
        }
      }}  variant='main' />
    </div>
       
    </>
  );

}
