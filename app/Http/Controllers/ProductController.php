<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ProductController extends Controller
{
    /**
     * Display a listing of products.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $page = isset($request->page) ? $request->page : 1;
        $perPage = isset($request->per_page) ? $request->per_page : 10;
        try {
            $response = Http::withToken(config('services.packtapi.token'))->get(config('services.packtapi.endpoint').'products?page='.$page.'&limit='.$perPage);       
            if($response->failed()){
                return response()->json([
                    'status' => 'error',
                    'message' => 'Something went wrong!',
                ]);
            }   
            $response = json_decode($response, true);
            $response['products'] = $this->prepareProductResponse($response['products']);
            return response()->json([
                'status' => 'success',
                'message' => '',
                'data' => $response
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => 'error',
                'message' => $th->getMessage(),
            ]);
        }

    }

    /**
     * Preapre product response attaching the cover image
     *
     * @param  array  $data
     * @return \Illuminate\Http\Response
     */
    public function prepareProductResponse($productData){
        try {
            $newArray = [];
            foreach ($productData as $key => $value) {
                $value['cover_image'] = $this->getProductCoverImage($value['id']);
                $newArray[] = $value;
            }
            return $newArray;
        } catch (\Throwable $th) {
            return $productData;
        }
    }

    /**
     * Get cover image of product
     *
     * @param  int  $productId
     * @param  int  $coverSize
     * @return \Illuminate\Http\Response
     */
    public function getProductCoverImage($productId, $coverSize = 'small'){
        try {
            $response = Http::withToken(config('services.packtapi.token'))->get(config('services.packtapi.endpoint').'products/'.$productId.'/cover/'.$coverSize);       
            if($response->successful()){
                $data = $response->getBody()->getContents();
                return 'data:image/png;base64,' . base64_encode($data);
            }   
            return '';
        } catch (\Throwable $th) {
            //throw $th;
            return '';
        }
    }

    /**
    * Display the specified product.
    *
    * @param  int  $id
    * @return Response
    */
    public function show($id)
    {
        try {
            $response = Http::withToken(config('services.packtapi.token'))->get(config('services.packtapi.endpoint').'products/'.$id);       
            if($response->failed()){
                return response()->json([
                    'status' => 'error',
                    'message' => 'Something went wrong!',
                ]);
            }   
            $response = json_decode($response, true);
            $response['cover_image'] = $this->getProductCoverImage($response['id'], 'large');
            return response()->json([
                'status' => 'success',
                'message' => '',
                'data' => $response
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => 'error',
                'message' => $th->getMessage(),
            ]);
        }
    }
}
