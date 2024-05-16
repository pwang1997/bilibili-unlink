package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"time"

	"github.com/CuteReimu/bilibili/v2"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

type Media struct {
	Bvid  string `json:"bvid"`
	Id    int    `json:"id"`
	Title string `json:"title"`
}

type Data struct {
	Has_more bool    `json:"has_more"`
	TTL      int     `json:"ttl"`
	Medias   []Media `json:"medias"`
}

type FavResponse struct {
	Code int  `json:"code"`
	TTL  int  `json:"ttl"`
	Data Data `json:"data"`
}

func getFav(mediumId string, pageNumber int, pageSize int) FavResponse {
	requestUrl := fmt.Sprintf("https://api.bilibili.com/x/v3/fav/resource/list?media_id=%s&pn=%d&ps=%d&keyword=&order=mtime&type=0&tid=0", mediumId, pageNumber, pageSize)
	resp, err := http.Get(requestUrl)
	if err != nil {
		fmt.Println("Error making GET request:", err)
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Error reading response body:", err)
	}

	var favResponse FavResponse
	if err := json.Unmarshal(body, &favResponse); err != nil {
		fmt.Println("Error parsing JSON:", err)
	}

	return favResponse
}

func getUnavailableIds(mediumId string, pageSize int) []int {

	var pageNumber = 1
	var hasMore = true
	var idsToDelete []int

	for hasMore {
		var favResponse FavResponse = getFav(mediumId, pageNumber, pageSize)

		var data = favResponse.Data
		var mediaList = data.Medias
		hasMore = data.Has_more

		fmt.Println("PageNumber: ", pageNumber, ", has more to fetch: ", hasMore)

		for i := 0; i < len(mediaList); i++ {
			var Title = mediaList[i].Title

			if Title == "已失效视频" {
				idsToDelete = append(idsToDelete, mediaList[i].Id)
			}
		}
		pageNumber++
		time.Sleep(2 * time.Second)
	}

	return idsToDelete
}

var client = bilibili.New()
var isSignIn = false

func signIn() {
	qrCode, _ := client.GetQRCode()
	qrCode.Print()

	result, err := client.LoginWithQRCode(bilibili.LoginWithQRCodeParam{
		QrcodeKey: qrCode.QrcodeKey,
	})
	if err == nil && result.Code == 0 {
		log.Println("登录成功")
		isSignIn = true
	}
}

func (a *App) DissociateOrphanFav(mediumId string) {
	if !isSignIn {
		signIn()
	}

	pageSize := 20

	client.CleanFavourResources(bilibili.MediaIdParam{
		MediaId: 2497039877,
	})

	println("Done...")

	var idsToDelete []int = getUnavailableIds(mediumId, pageSize)

	fmt.Println("Bvs to delete: ", idsToDelete)
}
